package sgq.cmd;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import sgq.cmd.bean.Word;
import sgq.cmd.bean.WordSet;
import sgq.cmd.util.PMF;

import com.opensymphony.xwork2.ActionSupport;

public class ShowWordSetAction extends ActionSupport {
	/**
	 * 
	 */
	private static final long serialVersionUID = -3395587311772733785L;
	
	private String result;
	
	public String execute() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(WordSet.class);
		@SuppressWarnings("unchecked")
		List<WordSet> wordSets = (List<WordSet>) query.execute();
		result = "";
		for (WordSet wordSet: wordSets) {
			result += "wordset " + wordSet.getName();
			if (wordSet.getWords() != null) {
				result += ": total " + wordSet.getWords().size();
			}
			result += "<br>";
		}
		pm.close();
		return SUCCESS;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}

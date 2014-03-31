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
		WordSet wordSet = wordSets.get(0);
		result = "";
		result += "word set: " + wordSet.getName() + "\n";
		result += "word: " + wordSet.getWords().toArray(new Word[0])[0].toString();
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
